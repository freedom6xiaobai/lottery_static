var express = require('express');
var router = express.Router();

/**
 * Simple in-memory data store (for demo purposes)
 */
let items = [
    {id: 1, name: 'Item 1'},
    {id: 2, name: 'Item 2'}
];

/**
 * GET /api/items
 * Get all items
 */
router.get('/api/items', function (req, res) {
    res.json({
        success: true,
        data: items
    });
});

/**
 * GET /api/items/:id
 * Get single item
 */
router.get('/api/items/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    res.json({
        success: true,
        data: item
    });
});

/**
 * POST /api/items
 * Create new item
 */
router.post('/api/items', function (req, res) {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
    }

    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name
    };

    items.push(newItem);

    res.status(201).json({
        success: true,
        data: newItem
    });
});

/**
 * PUT /api/items/:id
 * Update item
 */
router.put('/api/items/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const {name} = req.body;

    const item = items.find(i => i.id === id);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    item.name = name || item.name;

    res.json({
        success: true,
        data: item
    });
});

/**
 * DELETE /api/items/:id
 * Delete item
 */
router.delete('/api/items/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    const deleted = items.splice(index, 1);

    res.json({
        success: true,
        data: deleted[0]
    });
});

module.exports = router;

