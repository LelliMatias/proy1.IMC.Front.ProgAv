// src/ImcForm.test/ImcForm.errores.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ImcForm from "../ImcForm";
import { validateImcInputs } from "../utils/validation";

jest.mock("../utils/validation");

const mockApi = {
  post: jest.fn(),
  get: jest.fn(),
};

describe("ImcForm - Errores generales y manejo de mensajes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderAndDisableNativeValidation = (api = mockApi) => {
    const { container } = render(<ImcForm api={api} />);
    const form = container.querySelector("form") as HTMLFormElement | null;
    if (form) form.noValidate = true;
    return { container };
  };

  test("cuando la API falla, muestra mensaje genérico de conexión y no muestra resultado", async () => {
    (validateImcInputs as jest.Mock).mockReturnValue({ isValid: true });
    mockApi.post.mockRejectedValue(new Error("network error"));

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    const err = await screen.findByText(/Error al calcular el IMC\. Verifica la conexión con el servidor\./i);
    expect(err).toBeInTheDocument();

    expect(screen.queryByText(/IMC:/)).toBeNull();
    expect(mockApi.post).toHaveBeenCalled();
  });

  test("limpieza de errores previos: error de validación desaparece cuando se corrige y la API responde", async () => {
    // primer submit: validación falla
    (validateImcInputs as jest.Mock).mockReturnValueOnce({
      isValid: false,
      error: "Por favor, ingresa valores numéricos positivos para altura y peso.",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "600" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "0" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    expect(
      await screen.findByText((content) =>
        content.includes("Por favor, ingresa valores numéricos positivos")
      )
    ).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();

    // segundo submit: validación pasa y API responde
    (validateImcInputs as jest.Mock).mockReturnValueOnce({ isValid: true });
    const mockResponse = { imc: 24.22, categoria: "Peso normal" };
    mockApi.post.mockResolvedValueOnce(mockResponse);

    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "75" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.756" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    // ahora se muestra el resultado y el mensaje previo desaparece
    expect(await screen.findByText(/IMC:\s*24\.22/)).toBeInTheDocument();
    expect(screen.queryByText(/Por favor, ingresa valores numéricos positivos/i)).toBeNull();
  });

  test("solo se muestra un mensaje de error a la vez; el último reemplaza al anterior", async () => {
    // primer error
    (validateImcInputs as jest.Mock).mockReturnValueOnce({
      isValid: false,
      error: "El peso no puede superar los 500 kg.",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "600" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    expect(await screen.findByText(/El peso no puede superar los 500 kg\./i)).toBeInTheDocument();

    // segundo error distinto (altura)
    (validateImcInputs as jest.Mock).mockReturnValueOnce({
      isValid: false,
      error: "La altura no puede superar los 3 metros.",
    });

    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "4.0" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    // ahora debe mostrarse el mensaje de altura y el de peso debe desaparecer
    expect(await screen.findByText(/La altura no puede superar los 3 metros\./i)).toBeInTheDocument();
    expect(screen.queryByText(/El peso no puede superar los 500 kg\./i)).toBeNull();
  });
});
