// src/ImcForm.test/ImcForm.altura.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ImcForm from "../ImcForm";
import { validateImcInputs } from "../utils/validation";

jest.mock("../utils/validation");

const mockApi = {
  post: jest.fn(),
  get: jest.fn(),
};

describe("ImcForm - Validaciones de Altura", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper para renderizar y desactivar la validación nativa del navegador
  const renderAndDisableNativeValidation = (api = mockApi) => {
    const { container } = render(<ImcForm api={api} />);
    const form = container.querySelector("form") as HTMLFormElement | null;
    if (form) form.noValidate = true;
    return { container };
  };

  test("debe mostrar error si la altura es 0", async () => {
    (validateImcInputs as jest.Mock).mockReturnValue({
      isValid: false,
      error: "Por favor, ingresa valores numéricos positivos para altura y peso.",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    // matcher flexible para evitar problemas de fragmentación del texto en el DOM
    expect(
      await screen.findByText((content) =>
        content.includes("Por favor, ingresa valores numéricos positivos")
      )
    ).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test("debe mostrar error si la altura es negativa", async () => {
    (validateImcInputs as jest.Mock).mockReturnValue({
      isValid: false,
      error: "Por favor, ingresa valores numéricos positivos para altura y peso.",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "-1.70" } });
    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    expect(
      await screen.findByText((content) =>
        content.includes("Por favor, ingresa valores numéricos positivos")
      )
    ).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test("debe mostrar error si la altura es mayor o igual a 3m", async () => {
    (validateImcInputs as jest.Mock).mockReturnValue({
      isValid: false,
      error: "La altura no puede superar los 3 metros.",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "3.5" } });
    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    expect(await screen.findByText(/La altura no puede superar los 3 metros\./i)).toBeInTheDocument();
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test("no debe mostrar error si la altura es válida (ej. 1.75) y debe llamar al API", async () => {
    (validateImcInputs as jest.Mock).mockReturnValue({
      isValid: true,
    });

    mockApi.post.mockResolvedValueOnce({
      imc: 22.86,
      categoria: "Normal",
    });

    renderAndDisableNativeValidation();

    fireEvent.change(screen.getByLabelText(/Altura/i), { target: { value: "1.75" } });
    fireEvent.change(screen.getByLabelText(/Peso/i), { target: { value: "70" } });
    fireEvent.click(screen.getByRole("button", { name: /calcular/i }));

    // verificamos que se llamó al API con payload numérico
    expect(mockApi.post).toHaveBeenCalledWith(
      expect.stringContaining("/imc/calcular"),
      { altura: 1.75, peso: 70 }
    );

    expect(await screen.findByText(/IMC:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Categoría:/i)).toBeInTheDocument();
  });
});
