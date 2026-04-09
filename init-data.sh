#!/bin/bash
# Wait for backend to be ready
echo "Waiting for backend..."
until curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/branches | grep -q "200"; do
  sleep 2
done
echo "Backend is ready!"

API="http://localhost:8081"

# Register users
echo "Creating users..."
curl -s -X POST $API/api/auth/register -H "Content-Type: application/json" -d '{"name":"Diana Mamytova","email":"diana@coffeehub.com","password":"password123"}' > /dev/null
curl -s -X POST $API/api/auth/register -H "Content-Type: application/json" -d '{"name":"Marcus Thorne","email":"marcus@test.com","password":"password123"}' > /dev/null
curl -s -X POST $API/api/auth/register -H "Content-Type: application/json" -d '{"name":"Sarah Jenkins","email":"sarah@test.com","password":"password123"}' > /dev/null

# Set roles
echo "Setting roles..."
docker exec coffeehub-db psql -U postgres -d coffee_shop -c "
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'diana@coffeehub.com';
UPDATE users SET role = 'ADMIN' WHERE email = 'marcus@test.com';
"

# Get admin token
ADMIN_TOKEN=$(curl -s -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"diana@coffeehub.com","password":"password123"}' | python3 -c "import json,sys;print(json.load(sys.stdin)['token'])")

# Create branches
echo "Creating branches..."
docker exec coffeehub-db psql -U postgres -d coffee_shop -c "
INSERT INTO branches (name, address, city, phone, description, is_active, created_at) VALUES
('The Bean Haven', '452 Market St, CA 94104', 'San Francisco', '+1 415-555-0123', 'A cozy haven for coffee lovers featuring single-origin beans from Ethiopia and Colombia.', true, NOW()),
('Roast & Relic', '12 Baker Street, Marylebone', 'London', '+44 20-7946-0958', 'Victorian-inspired coffee house with modern roasting techniques.', true, NOW()),
('Sip & Solace', '1 Chome, Shibuya', 'Tokyo', '+81 3-1234-5678', 'Minimalist Japanese-inspired coffee bar.', true, NOW());

INSERT INTO coffee_tables (table_number, capacity, is_available, branch_id) VALUES
(1, 2, true, 1), (2, 4, true, 1), (3, 4, true, 1), (4, 6, true, 1), (5, 8, true, 1),
(1, 2, true, 2), (2, 4, true, 2), (3, 6, true, 2),
(1, 2, true, 3), (2, 4, true, 3);

INSERT INTO categories (name, description, branch_id) VALUES
('Coffee', 'Hot & cold coffee drinks', 1), ('Desserts', 'Fresh pastries & cakes', 1), ('Breakfast', 'Morning meals', 1),
('Coffee', 'Specialty brews', 2), ('Cold Brews', 'Iced & nitro', 2),
('Coffee', 'Precision brews', 3), ('Desserts', 'Japanese sweets', 3);

INSERT INTO menu_items (name, description, price, is_available, discount, category_id, created_at) VALUES
('Flat White', 'Double shot of espresso with silky micro-foam.', 4.50, true, 20, 1, NOW()),
('Iced Vanilla Latte', 'Premium vanilla bean syrup with chilled espresso.', 5.25, true, 0, 1, NOW()),
('Hazelnut Croissant', 'Warm buttery croissant with hazelnut cream.', 4.75, false, 0, 2, NOW()),
('Single Origin V60', 'Ethiopian single-origin, hand-poured.', 6.00, true, 0, 1, NOW()),
('Artisan Avo Toast', 'Sourdough with smashed avocado and poached egg.', 12.50, true, 15, 3, NOW()),
('Signature Cold Brew', '18-hour steeped cold brew.', 5.50, true, 0, 5, NOW()),
('Matcha Latte', 'Ceremonial grade matcha with oat milk.', 5.75, true, 0, 6, NOW()),
('Mochi Set', 'Assorted mochi with seasonal flavors.', 8.00, true, 10, 7, NOW());

INSERT INTO reviews (user_id, branch_id, rating, comment, is_approved, created_at) VALUES
(3, 1, 5, 'Absolutely love this place! The flat white is perfection.', true, NOW()),
(3, 2, 4, 'Great V60 pour-over, knowledgeable baristas.', true, NOW()),
(2, 1, 5, 'Best coffee in the city, cozy atmosphere.', true, NOW());
"

echo "Done! Test accounts:"
echo "  SuperAdmin: diana@coffeehub.com / password123"
echo "  Admin: marcus@test.com / password123"
echo "  User: sarah@test.com / password123"
