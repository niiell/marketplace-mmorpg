import { render, fireEvent, waitFor } from "@testing-library/react";
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
  it("renders listing details", async () => {
    const { getByText, getByRole } = render(<ListingCard listing={mockListing} />);
    expect(getByText(/Test Item/i)).toBeInTheDocument();
    expect(getByText(/Test Category/i)).toBeInTheDocument();
    expect(getByText(/Test Game/i)).toBeInTheDocument();
    expect(getByText(/Stock: 5/i)).toBeInTheDocument();
    expect(getByText(/Test description/i)).toBeInTheDocument();
    expect(getByText(/seller1/i)).toBeInTheDocument();
    expect(getByText(/4.5/i)).toBeInTheDocument();

    const image = getByRole("img");
    expect(image).toHaveAttribute("src", mockListing.image_url);

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", `/listings/${mockListing.id}`);
  });

  it("renders seller details", async () => {
    const { getByText, getByRole } = render(<ListingCard listing={mockListing} />);
    const sellerAvatar = getByRole("img", { name: "seller avatar" });
    expect(sellerAvatar).toHaveAttribute("src", mockListing.seller.avatar_url);

    const sellerUsername = getByText(mockListing.seller.username);
    expect(sellerUsername).toBeInTheDocument();
  });
});