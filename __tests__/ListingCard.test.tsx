import { render } from "@testing-library/react";
import ListingCard from "../src/components/ListingCard";

const mockListing = {
  id: "1",
  title: "Test Item",
  price: 1000,
  image_url: "/test.jpg",
  category: "Test Category",
  game: "Test Game",
  stock: 5,
  description: "Test description",
  seller: {
    avatar_url: "/avatar.jpg",
    username: "seller1",
  },
  rating: 4.5,
};

describe("ListingCard", () => {
  it("renders listing details", () => {
    const { getByText } = render(<ListingCard listing={mockListing} />);
    expect(getByText(/Test Item/i)).toBeInTheDocument();
    expect(getByText(/Test Category/i)).toBeInTheDocument();
    expect(getByText(/Test Game/i)).toBeInTheDocument();
    expect(getByText(/Stok: 5/i)).toBeInTheDocument();
    expect(getByText(/Test description/i)).toBeInTheDocument();
    expect(getByText(/seller1/i)).toBeInTheDocument();
    expect(getByText(/4.5/i)).toBeInTheDocument();
  });
});
