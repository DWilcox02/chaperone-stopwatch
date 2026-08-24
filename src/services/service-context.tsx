import { createContext, useContext, useMemo } from "react";

import { defaultDatabaseAdapter, type DatabaseAdapter } from "./database";
import { createSessionExportService, type SessionExportService } from "./session-export";
import { createChildPdfService, type ChildPdfService } from "./session-pdf";

type ExportServices = {
    csv: SessionExportService;
    pdf: ChildPdfService;
};

const DatabaseContext = createContext<DatabaseAdapter>(defaultDatabaseAdapter);
const ExportServicesContext = createContext<ExportServices | null>(null);

export function DatabaseProvider({
    adapter = defaultDatabaseAdapter,
    children,
}: {
    adapter?: DatabaseAdapter;
    children: React.ReactNode;
}) {
    return <DatabaseContext.Provider value={adapter}>{children}</DatabaseContext.Provider>;
}

export function ExportServicesProvider({ children }: { children: React.ReactNode }) {
    const database = useContext(DatabaseContext);
    const services = useMemo(
        () => ({ csv: createSessionExportService({ database }), pdf: createChildPdfService({ database }) }),
        [database],
    );
    return <ExportServicesContext.Provider value={services}>{children}</ExportServicesContext.Provider>;
}

export function useDatabase(): DatabaseAdapter {
    return useContext(DatabaseContext);
}

export function useExportServices(): ExportServices {
    const services = useContext(ExportServicesContext);
    if (!services) throw new Error("useExportServices must be used within ExportServicesProvider");
    return services;
}