const { Level } = require('level')

// Create a database
const db = new Level('db', { valueEncoding: 'json' });

// Create (Insert)
export const create = async (key, value) => {
    try {
        await db.put(key, value);
        console.log(`Created: ${key} => ${value}`);
    } catch (err) {
        console.error('Create error:', err);
    }
};

// Read (Retrieve)
export const read = async (key) => {
    try {
        const value = await db.get(key);
        console.log(`Read: ${key} => ${value}`);
        return value;
    } catch (err) {
        if (err.notFound) {
            console.log(`Key ${key} not found`);
            return null;
        } else {
            console.error('Read error:', err);
        }
    }
};

// Update
export const update = async (key, newValue) => {
    try {
        await db.put(key, newValue);
        console.log(`Updated: ${key} => ${newValue}`);
    } catch (err) {
        console.error('Update error:', err);
    }
};

// Delete
export const remove = async (key) => {
    try {
        await db.del(key);
        console.log(`Deleted: ${key}`);
    } catch (err) {
        console.error('Delete error:', err);
    }
};

// Example usage
// (async () => {
//     await create('name', 'Alice');
//     await read('name');
//     await update('name', 'Bob');
//     await read('name');
//     await remove('name');
//     await read('name'); // Should indicate that the key was not found
// })();
