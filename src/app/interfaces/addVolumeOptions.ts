export interface addVolumeOptions {
    disk: {
        blockSize?: {
            custom?: {
                logical: number;  // Default 0
                physical: number; // Default 0
            };
            matchVolume?: {
                enabled?: true|false;
            };
        };
        bootOrder?: number;
        cache?: string;  // none, writethrough, writeback
        cdrom?: {
            bus?: string; // virtio / sata / scsi
            readonly?: true|false;
            tray?: string; // open / closed
        };
        disk?: {
            bus?: string; // virtio / sata / scsi / usb
            readonly?: true|false;
            pciAddress?: string; // 0000:81:01.10
        };
        errorPolicy?: string;
        io?: string;
        lun?: {
            bus?: string; // virtio / sata / scsi
            readonly?: true|false;
            reservation?: true|false; // 0000:81:01.10
        };
        name: string;
        serial?: string;  // defaults to disk name
        shareable?: true|false;
        tag?: string;
    };
    dryRun?: { };
    name: string;
    volumeSource: {
        dataVolume?: {
            hotpluggable?: true|false;
            name: string;
        };
        persistentVolumeClaim?: {
            claimName: string;
            hotpluggable?: true|false;
            readOnly?: true|false;
        };
    };
}
