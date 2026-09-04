# Patches for kubevirt-manager

This document describes the fixes for two bugs in kubevirt-manager upstream.

---

## Fix 1: VM Memory Update 422 Error

**File:** `src/app/services/kube-virt.service.ts`

**Problem:** Modifying VM memory in the UI returns `422 Unprocessable Entity`. KubeVirt validation requires `domain.memory.guest` ≤ `resources.limits.memory`, but the original code only patched `resources.requests.memory`.

**Solution:** Patch all three memory fields together in `scaleVm` and `scalePool`:
- `domain.memory.guest`
- `resources.requests.memory`
- `resources.limits.memory`

### Change 1.1: scaleVm (around line 150)

```diff
     scaleVm(namespace: string, name: string, cores: string, threads: string, sockets: string, memory: string): Observable<any> {
         var baseUrl ='./k8s/apis/kubevirt.io/v1';
         const headers = {
             'content-type': 'application/merge-patch+json',
             'accept': 'application/json'
         };
+        const mem = memory + 'Gi';
-        return this.http.patch(..., '{"spec":{"template":{"spec":{"domain":{"cpu":{...},"resources":{"requests":{"memory": "'+memory+'Gi"}}}}}}}', ...);
+        return this.http.patch(..., '{"spec":{"template":{"spec":{"domain":{"cpu":{...},"memory":{"guest":"'+mem+'"},"resources":{"requests":{"memory":"'+mem+'"},"limits":{"memory":"'+mem+'"}}}}}}}', ...);
     }
```

### Change 1.2: scalePool (around line 297)

```diff
     scalePool(namespace: string, name: string, cores: string, threads: string, sockets: string, memory: string): Observable<any> {
         ...
+        const mem = memory + 'Gi';
-        return this.http.patch(..., '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"domain":{"cpu":{...},"resources":{"requests":{"memory": "'+memory+'Gi"}}}}}}}}}', ...);
+        return this.http.patch(..., '{"spec":{"virtualMachineTemplate":{"spec":{"template":{"spec":{"domain":{"cpu":{...},"memory":{"guest":"'+mem+'"},"resources":{"requests":{"memory":"'+mem+'"},"limits":{"memory":"'+mem+'"}}}}}}}}}}', ...);
     }
```

---

## Fix 2: kubectl Download Failure (Dashboard 502)

**File:** `Dockerfile`

**Problem:** The nginx stage runs `curl` to download kubectl from dl.k8s.io. In environments where the registry requires a proxy or has network issues, the download fails and saves an error page (~239 bytes) instead of the binary (~56MB). This corrupts `/usr/local/bin/kubectl`, kubectl proxy fails to start, and the Dashboard/VM list returns 502 Connection Refused.

**Solution:** Download kubectl in the **builder** stage (which has network/proxy access for npm and git) and COPY the binary to the nginx stage.

### Change 2.1: Add kubectl download in builder stage (after npm run build)

```diff
 RUN cd /usr/src/app && \
     sed -i "s|nightly|${KVM_VERSION}|g" src/app/components/main-footer/main-footer.component.html && \
     npm run build
+
+# Download kubectl in builder stage (reliable network/proxy for npm/git)
+RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
+    chmod +x kubectl

 # OAUTH2 IMAGE
```

### Change 2.2: Replace curl in nginx stage with COPY from builder

```diff
 RUN mkdir -p /etc/nginx/location.d/ && \
     mkdir -p /etc/nginx/oauth.d/
-RUN curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl && \
-    chmod +x ./kubectl && \
-    mv ./kubectl /usr/local/bin
+COPY --from=builder /usr/src/app/kubectl /usr/local/bin/kubectl

 COPY entrypoint/90-oauth-proxy.sh
```

---

## Optional: HTTP Proxy Support for Build (for users behind firewall)

If you need to build behind an HTTP proxy, add these build args and ENV to the **builder** stage only:

```dockerfile
# Build Args
ARG HTTP_PROXY
ARG HTTPS_PROXY

# In builder stage:
ARG HTTP_PROXY
ARG HTTPS_PROXY
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV http_proxy=${HTTP_PROXY}
ENV https_proxy=${HTTPS_PROXY}
```

Then build with:
```bash
docker build --build-arg HTTP_PROXY=http://proxy:port --build-arg HTTPS_PROXY=http://proxy:port -t kubevirt-manager:tag .
```

**Note:** This is optional and not required for the upstream PR. Keep it in your local Dockerfile if needed.

---

## Files to Submit for PR

| File | Change |
|------|--------|
| `src/app/services/kube-virt.service.ts` | Fix 1 (memory patch) |
| `Dockerfile` | Fix 2 (kubectl in builder) — use the version **without** proxy args for upstream |
