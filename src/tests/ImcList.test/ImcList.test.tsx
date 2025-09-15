import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ImcList from '../../ImcList';
import '@testing-library/jest-dom';

// Mock adapter simple que tiene 'get' method
class MockAdapter {
    handler: (url: string) => any;
    constructor(handler: (url: string) => any) {
        this.handler = handler;
    }
    async get(url: string) {
        return this.handler(url);
    }
}

const fakeData = [
    { id: 2, peso: 80, altura: 1.8, imc: 24.69, categoria: 'normal', createdAt: '2025-09-14T12:00:00Z' },
    { id: 1, peso: 60, altura: 1.6, imc: 23.44, categoria: 'normal', createdAt: '2025-09-13T12:00:00Z' },
];

// Usamos MSW para interceptar si tu adapter hace fetch a una URL real.
// Pero ImcList usa un adapter que pasamos como prop; por eso probamos con MockAdapter.
describe('ImcList component', () => {
    it('muestra registros cuando la API responde correctamente', async () => {
        const adapter = new MockAdapter(async (url: string) => {
            // devolver estructura similar a axios: { data: [...] }
            return { data: fakeData };
        });

        render(<ImcList api={adapter as any} />);

        // Hacer click para traer datos
        fireEvent.click(screen.getByText(/Listar cálculos/i));

        await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());

        // Ahora los datos deben mostrarse
        expect(screen.getByText(/80/)).toBeInTheDocument();
        expect(screen.getByText(/1.8/)).toBeInTheDocument();
        expect(screen.getAllByText(/normal/i).length).toBeGreaterThan(0);
    });

    it('muestra error si la respuesta no es array', async () => {
        const adapter = new MockAdapter(async (url: string) => {
            return { data: { message: 'no es un array' } };
        });

        render(<ImcList api={adapter as any} />);
        fireEvent.click(screen.getByText(/Listar cálculos/i));
        await waitFor(() => expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument());
        expect(screen.getByText(/Respuesta inesperada del servidor/i)).toBeInTheDocument();
    });

    it('aplica filtros de fecha en la construcción del endpoint', async () => {
        let lastUrl = '';
        const adapter = new MockAdapter(async (url: string) => {
            lastUrl = url;
            return { data: fakeData };
        });

        render(<ImcList api={adapter as any} />);

        fireEvent.change(screen.getByLabelText(/Desde:/i), { target: { value: '2025-09-01' } });
        fireEvent.change(screen.getByLabelText(/Hasta:/i), { target: { value: '2025-09-30' } });

        fireEvent.click(screen.getByText(/Listar cálculos/i));

        await waitFor(() => expect(lastUrl).toContain('fechaInicio=2025-09-01'));
        expect(lastUrl).toContain('fechaFin=2025-09-30');
    });
});
