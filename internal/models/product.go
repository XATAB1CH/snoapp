package models

type Product struct {
	ProductID int64   `json:"product_id"`
	Name      string  `json:"name"`
	Price     float32 `json:"price"`
	ImgURL    string  `json:"img_url"`
}

func CreateProduct(name string, price float32, imgURL string) *Product {
	return &Product{
		Name:   name,
		Price:  price,
		ImgURL: imgURL,
	}
}
