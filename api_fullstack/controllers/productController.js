// import helpers
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

// import database
const db = require('../database')

module.exports = {
    getAllProduct: (req, res) => {
        // define query sql
        const queryProduct = `select id_product, name, price, stock, id as category_id, title as category from product p
                              left join category c
                              on p.category_id = c.id`

        db.query(queryProduct, (err, result) => {
            // check error
            if (err) return res.status(500).send(err)

            // if success
            res.status(200).send(result)
        })
    },
    addProduct: async (req, res) => {
        const { name, category_id, price, stock } = req.body
        try {
            const addQuery = `insert into product (name, category_id, price, stock) 
                              values (${db.escape(name)}, ${db.escape(category_id)}, ${db.escape(price)}, ${db.escape(stock)})`

            const result = await asyncQuery(addQuery)

            const getQuery = `select id_product, name, price, stock, id as category_id, title as category from product p
            left join category c
            on p.category_id = c.id`

            const resultUpdate = await asyncQuery(getQuery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    delProduct: async (req, res) => {
        try{
            const delQuery = `delete from product where id_product = ${db.escape(parseInt(req.params.id))}`

            const result = await asyncQuery(delQuery)

            const getQuery = `select id_product, name, price, stock, id as category_id, title as category from product p
            left join category c
            on p.category_id = c.id`

            const resultUpdate = await asyncQuery(getQuery)

            res.status(200).send(resultUpdate)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    editProduct: async (req, res) => {
        try{
            const editQuery = `update product set${generateQuery(req.body)} 
                               where id_product = ${db.escape(parseInt(req.params.id))}`

            const result = await asyncQuery(editQuery)

            const getDataProduct = `select id_product, name, price, stock, id as category_id, title as category from product p
            left join category c
            on p.category_id = c.id`

            const resultUpdate = await asyncQuery(getDataProduct)

            res.status(200).send(resultUpdate)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}