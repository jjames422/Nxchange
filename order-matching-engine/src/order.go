package main

// OrderType represents the type of order (buy/sell)
type OrderType int

const (
    BUY OrderType = iota
    SELL
)

// Order represents a buy or sell order
type Order struct {
    ID     int
    Amount float64
    Price  float64
    Type   OrderType
}

// OrderHeap implements heap.Interface for orders based on their price
type OrderHeap []*Order

func (h OrderHeap) Len() int           { return len(h) }
func (h OrderHeap) Less(i, j int) bool {
    if h[i].Type == BUY {
        return h[i].Price > h[j].Price
    }
    return h[i].Price < h[j].Price
}
func (h OrderHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *OrderHeap) Push(x interface{}) { *h = append(*h, x.(*Order)) }
func (h *OrderHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[0 : n-1]
    return x
}
