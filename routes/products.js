import express from "express";
import {Router} from "express";
import Product from "../models/products.js";
//import order from "../models/orders.js";

/**
 *  Get all products
 */
const router = new Router();

router.get("/", async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  /**
 * GET/:id
 * @description returns product by id
 */
  router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
/**
 * POST /
 * @description creates a new product
 */
router.post('/', async (req, res) => {
    const { name, description, price, quantityInStock, reorderLevel } = req.body;
  
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /**
 * PUT /:id
 */
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;
      
      const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
      res.json(updatedProduct);
  
    } catch (error) {
      console.log(error);
      res.json({msg: 'Product Not found!'})
    }
  });

  /***
   * delete/:id
   * Delete a product
   */
   
router.delete('/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  export default router;