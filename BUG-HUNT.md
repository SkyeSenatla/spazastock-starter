# Bug hunt (10 minutes)

Each snippet has at least one bug from Week 7. Under each one, write:

- **What breaks, and for whom:** one line.
- **The fix:** one line.

## 1

```tsx
{sales.map((sale, index) => <SaleRow key={index} sale={sale} />)}
```

- What breaks, and for whom: When sales are inserted or removed react can use the wrong row which will show old infromation.
- The fix: key={sale.id}

## 2

```tsx
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 1000)
}, [])
```

- What breaks, and for whom: This causes unecessary updates as the timer continues. 
- The fix: return () => clearInterval(intervalId)

## 3

```ts
const body = await (await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: json })).json()
localStorage.setItem('token', body.accessToken)
```

- What breaks, and for whom: A login request may fail without the correct JSON type and storing an access token in localStorage also exposes it.
- The fix: To keep the access token in memory rather than localStorage.

## 4

```ts
useQuery({ queryKey: ['products'], queryFn: () => getProducts(categoryId) })
```

- What breaks, and for whom: Switching categories can reuse another category's cached products, confusing the shopkeeper about what is available.
- The fix: Use the category iD as well

## 5

```ts
// SpazaStock's products endpoint
const hasMore = page.nextPageToken !== ''
```

- What breaks, and for whom: The API returns null on the final page allowing for customers to request pages that do not exist.
- The fix: checking that it is not equal to null

## 6

```ts
const cents = parseFloat(form.price) * 100
```

- What breaks, and for whom: floating-point rounding and parsing can give inaccurate sale amounts.
- The fix:

## 7

```tsx
const save = useMutation({ mutationFn: createSale })
<Button onClick={() => save.mutate(values)}>Save</Button>
```

- What breaks, and for whom:
- The fix:

## 8

```tsx
<span className="text-red-600">●</span>
```

- What breaks, and for whom:
- The fix:
