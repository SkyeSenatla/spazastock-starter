# Bug hunt (10 minutes)

Each snippet has at least one bug from Week 7. Under each one, write:

- **What breaks, and for whom:** one line.
- **The fix:** one line.

## 1

```tsx
{sales.map((sale, index) => <SaleRow key={index} sale={sale} />)}
```

- What breaks, and for whom: Using the array index as a key can cause incorrect component state when sales are added, removed, or reordered, affecting users.
- The fix: Use a unique, stable identifier: key={sale.id}

## 2

```tsx
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 1000)
}, [])
```

- What breaks, and for whom: The interval is never cleared, causing memory leaks and duplicate timers in React Strict Mode.
- The fix: Return a cleanup function: return () => clearInterval(id)

## 3

```ts
const body = await (await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: json })).json()
localStorage.setItem('token', body.accessToken)
```

- What breaks, and for whom: Storing access tokens in localStorage exposes them to theft through XSS attacks, compromising user accounts. The code also fails to check HTTP errors.
- The fix: Prefer secure, HttpOnly, SameSite cookies for session authentication and check response.ok before processing the response.

## 4

```ts
useQuery({ queryKey: ['products'], queryFn: () => getProducts(categoryId) })
```

- What breaks, and for whom: Different categories share the same cache key, potentially displaying incorrect products to users.
- The fix: Include the category ID in the query key: queryKey: ['products', categoryId]

## 5

```ts
// SpazaStock's products endpoint
const hasMore = page.nextPageToken !== ''
```

- What breaks, and for whom: Pagination never stops because the API returns null, not an empty string, when there are no more pages.
- The fix: Check for null: const hasMore = page.nextPageToken !== null

## 6

```ts
const cents = parseFloat(form.price) * 100
```

- What breaks, and for whom: Floating-point calculations can introduce rounding errors, resulting in incorrect sale amounts for customers and shop owners.
- The fix: Parse the prices as text, separate rands and cents, and convert using integer arithmetic without parseFloat

## 7

```tsx
const save = useMutation({ mutationFn: createSale })
<Button onClick={() => save.mutate(values)}>Save</Button>
```

- What breaks, and for whom: Repeated clicks can submit multiple sales, potentially reducing stock more than intended.
- The fix: Disable the button while the mutation is pending: disabled={save.isPending}. Also guard the submission handler aginst repeated requests

## 8

```tsx
<span className="text-red-600">●</span>
```

- What breaks, and for whom: A red dot communicates status through colour alone, making it inaccessible to users with colour-vision deficiencies or screen readers
- The fix: Add Add descriptive text and an accessible label, such as <span role="status">● Out of stock</span>, with appropriate styling.
