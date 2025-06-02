import { render, fireEvent, waitFor } from "@testing-library/react";
import ListingCard from "../src/components/ListingCard";
import { CurrencyProvider } from '../src/context/CurrencyContext';
import { CartProvider } from '../src/context/CartContext';

const mockListing = {
  id: "1",
  title: "Test Item",
  price: 1000,
  image: "/test.jpg",
  category: "Test Category",
  rarity: "Rare",
  level: 50,
  seller: {
    name: "seller1",
    rating: 4.5,
    avatarUrl: "/avatar.jpg"
  }
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CurrencyProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </CurrencyProvider>
);

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe("ListingCard", () => {
  it("renders listing details", async () => {
    const { getByText, getByRole } = renderWithProviders(<ListingCard {...mockListing} />);
    
    expect(getByText(/Test Item/i)).toBeInTheDocument();
    expect(getByText(/Test Category/i)).toBeInTheDocument();
    expect(getByText(/Level 50/i)).toBeInTheDocument();
    expect(getByText(/Rare/i)).toBeInTheDocument();
    expect(getByText(/seller1/i)).toBeInTheDocument();
    expect(getByText(/4.5/i)).toBeInTheDocument();

    const image = getByRole("img", { name: "Image of Test Item" });
    expect(image).toBeInTheDocument();

    const link = getByRole("link", { name: "View details for Test Item" });
    expect(link).toHaveAttribute("href", "/product/1");
  });

  it("renders seller details", async () => {
    const { getByText } = renderWithProviders(<ListingCard {...mockListing} />);
    const sellerName = getByText(mockListing.seller.name);
    const sellerRating = getByText("4.5");
    expect(sellerName).toBeInTheDocument();
    expect(sellerRating).toBeInTheDocument();
  });

  it("renders with list view mode", async () => {
    const { container } = renderWithProviders(
      <ListingCard {...mockListing} viewMode="list" />
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });
});