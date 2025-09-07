import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImcForm from './ImcForm';
import axios from 'axios';

jest.mock('axios');

describe('ImcForm', () => {
    it('renderiza los campos de peso y altura', () => {
        render(<ImcForm />);
        expect(screen.getByLabelText(/peso/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();
    });

    it('calcula el IMC correctamente', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: {
                imc: 22.86,
                categoria: 'Normal',
            },
        });
        render(<ImcForm />);
        fireEvent.change(screen.getByLabelText(/peso/i), { target: { value: '70' } });
        fireEvent.change(screen.getByLabelText(/altura/i), { target: { value: '1.75' } });
        fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
        // Espera a que aparezca el resultado
        expect(await screen.findByText(/IMC:/i)).toBeInTheDocument();
    });
    it('muestra error si los datos son inválidos', () => {
        render(<ImcForm />);
        fireEvent.change(screen.getByLabelText(/peso/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/altura/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
        expect(screen.getByText(/ingresa valores válidos/i)).toBeInTheDocument();
    });
});
