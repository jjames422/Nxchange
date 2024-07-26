package main

import (
    "container/heap"
    "fmt"
)

// OrderBook represents the collection of buy and sell orders
type OrderBook struct {
    BuyOrders  *OrderHeap
    SellOrders *OrderHeap
}

// NewOrderBook creates a new OrderBook
func NewOrderBook() *OrderBook {
    buyOrders := &OrderHeap{}
    sellOrders := &OrderHeap{}
    heap.Init(buyOrders)
    heap.Init(sellOrders)
    return &OrderBook{
        BuyOrders:  buyOrders,
        SellOrders: sellOrders,
    }
}

// AddOrder adds an order to the order book
func (ob *OrderBook) AddOrder(order *Order) {
    if order.Type == BUY {
        heap.Push(ob.BuyOrders, order)
    } else {
        heap.Push(ob.SellOrders, order)
    }
}

// MatchOrders matches buy and sell orders in the order book
func (ob *OrderBook) MatchOrders() {
    for ob.BuyOrders.Len() > 0 && ob.SellOrders.Len() > 0 {
        buyOrder := heap.Pop(ob.BuyOrders).(*Order)
        sellOrder := heap.Pop(ob.SellOrders).(*Order)

        if buyOrder.Price >= sellOrder.Price {
            // Match orders
            amount := min(buyOrder.Amount, sellOrder.Amount)
            fmt.Printf("Matched Order: Buy ID %d and Sell ID %d for Amount %.2f at Price %.2f\n",
                buyOrder.ID, sellOrder.ID, amount, sellOrder.Price)

            // Update remaining amounts
            buyOrder.Amount -= amount
            sellOrder.Amount -= amount

            // Push remaining orders back to the heap if there's still remaining amount
            if buyOrder.Amount > 0 {
                heap.Push(ob.BuyOrders, buyOrder)
            }
            if sellOrder.Amount > 0 {
                heap.Push(ob.SellOrders, sellOrder)
            }
        } else {
            // Orders do not match, push them back
            heap.Push(ob.BuyOrders, buyOrder)
            heap.Push(ob.SellOrders, sellOrder)
            break
        }
    }
}

// min returns the smaller of two float64 values
func min(a, b float64) float64 {
    if a < b {
        return a
    }
    return b
}
