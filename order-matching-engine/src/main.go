package main

import (
    "fmt"
)

func main() {
    orderBook := NewOrderBook()

    // Add some sample orders
    orderBook.AddOrder(&Order{ID: 1, Amount: 10, Price: 100, Type: BUY})
    orderBook.AddOrder(&Order{ID: 2, Amount: 5, Price: 101, Type: BUY})
    orderBook.AddOrder(&Order{ID: 3, Amount: 7, Price: 99, Type: SELL})
    orderBook.AddOrder(&Order{ID: 4, Amount: 8, Price: 102, Type: SELL})

    // Match orders
    orderBook.MatchOrders()

    // Print the remaining orders
    fmt.Println("Buy Orders:")
    for _, order := range *orderBook.BuyOrders {
        fmt.Printf("ID: %d, Amount: %.2f, Price: %.2f\n", order.ID, order.Amount, order.Price)
    }

    fmt.Println("Sell Orders:")
    for _, order := range *orderBook.SellOrders {
        fmt.Printf("ID: %d, Amount: %.2f, Price: %.2f\n", order.ID, order.Amount, order.Price)
    }
}
