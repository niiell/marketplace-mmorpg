import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../src/components/Navbar";
import { CurrencyProvider } from '../src/context/CurrencyContext';
import { CartProvider } from '../src/context/CartContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CurrencyProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </CurrencyProvider>
);

describe("Navbar", () => {
  beforeEach(() => {
    render(<Navbar />, { wrapper: TestWrapper });
  });

  it("renders the site title", () => {
    expect(screen.getByText(/Marketplace MMORPG SEA/i)).toBeInTheDocument();
  });

  it("toggles dark mode button", async () => {
    const button = screen.getByRole("button", { name: /toggle dark mode/i });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await userEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("renders language switcher select", () => {
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});