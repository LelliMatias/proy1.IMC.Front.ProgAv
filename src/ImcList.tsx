import { useState } from "react";
import { API_URL } from "./config/api";
import { HttpApadter } from "./api/axios.adapter";

interface ImcRecord {
    id: number;
    // la API puede devolver createdAt, fecha o fechaHora; los manejamos todos
    createdAt?: string;
    fecha?: string;
    fechaHora?: string;
    peso: number;
    altura: number;
    imc: number;
    categoria: string;
}

interface ImcListProps {
    api: HttpApadter;
}

function ImcList({ api }: ImcListProps) {
    const [registros, setRegistros] = useState<ImcRecord[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");

    const fetchData = async () => {
        setError("");
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append("fechaInicio", fechaInicio);
            if (fechaFin) params.append("fechaFin", fechaFin);

            const url = `${API_URL}/imc/historial${params.toString() ? "?" + params.toString() : ""}`;

            // tu adapter puede devolver resp.data o resp directamente
            const resp: any = await api.get(url);
            const data = resp && (resp.data ?? resp);

            console.log("Respuesta /imc/historial:", data);

            if (!Array.isArray(data)) {
                setError("Respuesta inesperada del servidor.");
                setRegistros([]);
            } else {
                setRegistros(data);
            }
        } catch (err: any) {
            console.error("Error al traer historial:", err);
            // si el backend envía message en err.response.data.message lo mostramos
            const serverMsg = err?.response?.data?.message ?? err?.message;
            setError(serverMsg || "Error al cargar los cálculos.");
            setRegistros([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFechaInicio("");
        setFechaFin("");
    };

    const formatFecha = (r: ImcRecord) => {
        const raw = r.createdAt ?? r.fecha ?? r.fechaHora;
        if (!raw) return "—";
        try {
            return new Date(raw).toLocaleString();
        } catch {
            return String(raw);
        }
    };

    return (
        <div>
            <h2>Historial de Cálculos</h2>

            <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <label>
                    Desde:
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        style={{ marginLeft: 6 }}
                    />
                </label>

                <label>
                    Hasta:
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        style={{ marginLeft: 6 }}
                    />
                </label>

                <button onClick={fetchData} disabled={loading}>
                    {loading ? "Cargando..." : "Listar cálculos"}
                </button>

                <button onClick={clearFilters} disabled={loading}>
                    Limpiar filtros
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {registros.length > 0 ? (
                <table border={1} cellPadding={8} style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Peso (kg)</th>
                            <th>Altura (m)</th>
                            <th>IMC</th>
                            <th>Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((r) => (
                            <tr key={r.id}>
                                <td>{formatFecha(r)}</td>
                                <td>{r.peso}</td>
                                <td>{r.altura}</td>
                                <td>{Number(r.imc).toFixed(2)}</td>
                                <td>{r.categoria}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No hay registros aún.</p>
            )}
        </div>
    );
}

export default ImcList;
