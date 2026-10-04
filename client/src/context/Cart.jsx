import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cart")
            return savedCart ? JSON.parse(savedCart) : []
        } catch (e) {
            console.error("Failed to parse cart from localStorage:", e)
            return []
        }
    })

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(cart))
        } catch (e) {
            console.error("Failed to save cart to localStorage:", e)
        }
    }, [cart])

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        const prodId = product.id || product._id
        const prodPrice = Number(product.price) || 0
        const prodImage = product.image || product.imageURL || ""

        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === prodId)
            if (existingIndex > -1) {
                const updated = [...prevCart]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                }
                return updated
            } else {
                return [
                    ...prevCart,
                    {
                        id: prodId,
                        productId: prodId,
                        name: product.name,
                        price: prodPrice,
                        image: prodImage,
                        category: product.category || "General",
                        quantity: quantity
                    }
                ]
            }
        })

        if (window.toastify) {
            window.toastify(`"${product.name}" added to cart!`, "success")
        }
    }

    // Update quantity of an item
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: Number(quantity) } : item
            )
        )
    }

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId))
        if (window.toastify) {
            window.toastify("Item removed from cart", "info")
        }
    }

    // Clear entire cart
    const clearCart = () => {
        setCart([])
        try {
            localStorage.removeItem("cart")
        } catch (e) {
            console.error(e)
        }
    }

    // Total count of all items in cart
    const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0)

    // Total price of all items in cart
    const cartTotal = cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity) || 0), 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
export default CartContext
