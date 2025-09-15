// src/ImcForm.test/ImcForm.peso.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ImcForm from "../../ImcForm";
import { validateImcInputs } from "../../utils/validation";

jest.mock("../../utils/validation");

const mockApi = {
  post: jest.fn(),
  get: jest.fn(),
};

describe("ImcForm - Validaciones de Peso", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderAndDisableNativeValidation = (api = mockApi) => {
    const { container } = render(<ImcForm api={api} />);
    const form = container.querySelector("form") as HTMLFormElement | null;
    if (form) form.noValidate = true;
    return { container };
  };

  describe("Peso inválido - Valores no permitidos", () => {
    test("debe rechazar peso igual a 0", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({
        isValid: false,
        error: "Por favor, ingresa valores numéricos positivos para altura y peso.",
      });

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "0" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(
        await screen.findByText((content) =>
          content.includes("Por favor, ingresa valores numéricos positivos")
        )
      ).toBeInTheDocument();

      expect(mockApi.post).not.toHaveBeenCalled();
    });

    test("debe rechazar peso negativo", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({
        isValid: false,
        error: "Por favor, ingresa valores numéricos positivos para altura y peso.",
      });

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "-25" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(
        await screen.findByText((content) =>
          content.includes("Por favor, ingresa valores numéricos positivos")
        )
      ).toBeInTheDocument();

      expect(mockApi.post).not.toHaveBeenCalled();
    });

    test("debe rechazar exactamente 500 kg (límite) y mayor a 500 kg", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({
        isValid: false,
        error: "El peso no puede superar los 500 kg.",
      });

      renderAndDisableNativeValidation();

      // caso exactamente 500
      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "500" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(await screen.findByText(/El peso no puede superar los 500 kg\./i)).toBeInTheDocument();
      expect(mockApi.post).not.toHaveBeenCalled();

      // caso >500
      (validateImcInputs as jest.Mock).mockReturnValueOnce({
        isValid: false,
        error: "El peso no puede superar los 500 kg.",
      });

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "600" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(await screen.findByText(/El peso no puede superar los 500 kg\./i)).toBeInTheDocument();
      expect(mockApi.post).not.toHaveBeenCalled();
    });
  });

  describe("Peso válido - Valores permitidos", () => {
    test("debe aceptar peso válido en el límite inferior (0.1 kg) y llamar al API", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({ isValid: true });
      const mockResponse = { imc: 1.0, categoria: "Test" };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "0.1" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(mockApi.post).toHaveBeenCalledWith(
        expect.stringContaining("/imc/calcular"),
        { altura: 1, peso: 0.1 }
      );

      expect(await screen.findByText(/IMC:/i)).toBeInTheDocument();
    });

    test("debe aceptar peso válido en el límite superior (499 kg) y llamar al API", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({ isValid: true });
      const mockResponse = { imc: 24.0, categoria: "Test" };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "499" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "2.5" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(mockApi.post).toHaveBeenCalledWith(
        expect.stringContaining("/imc/calcular"),
        { altura: 2.5, peso: 499 }
      );

      expect(await screen.findByText(/IMC:/i)).toBeInTheDocument();
    });

    test("debe manejar correctamente decimales en peso", async () => {
      (validateImcInputs as jest.Mock).mockReturnValue({ isValid: true });
      const mockResponse = { imc: 20.41, categoria: "Peso normal" };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70.5" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(mockApi.post).toHaveBeenCalledWith(
        expect.stringContaining("/imc/calcular"),
        { altura: 1.75, peso: 70.5 }
      );

      expect(await screen.findByText(/IMC:\s*20\.41/)).toBeInTheDocument();
    });

    test("limpieza de errores previos: corrige peso inválido y obtiene resultado", async () => {
      (validateImcInputs as jest.Mock).mockReturnValueOnce({
        isValid: false,
        error: "El peso no puede superar los 500 kg.",
      });

      renderAndDisableNativeValidation();

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "600" } });
      fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(await screen.findByText(/El peso no puede superar los 500 kg\./i)).toBeInTheDocument();
      expect(mockApi.post).not.toHaveBeenCalled();

      (validateImcInputs as jest.Mock).mockReturnValueOnce({ isValid: true });
      const mockResponse = { imc: 24.22, categoria: "Peso normal" };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "75" } });
      fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

      expect(await screen.findByText(/IMC:\s*24\.22/)).toBeInTheDocument();
      expect(screen.queryByText(/El peso no puede superar los 500 kg\./i)).toBeNull();
    });
  });
});
