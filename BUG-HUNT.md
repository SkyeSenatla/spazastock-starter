# Bug hunt (10 minutes)

Each snippet has at least one bug from Week 7. Under each one, write:

- **What breaks, and for whom:** one line.
- **The fix:** one line.

## 1

```tsx
{sales.map((sale, index) => <SaleRow key={index} sale={sale} />)}
```

- What breaks and for whom: Sales row breaks because of "/>"
- The fix: {sales.map((sale, index) => <SaleRow key={index} sale={sale})}

## 2

```tsx
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 1000)
}, [])
```

- What breaks, and for whom: the date doesnt specifiy the date formate
- The fix: DateAtUtc
## 3

```ts
const body = await (await fetch(`${API}/api/v1/auth/login`, { method: 'POST', body: json })).json()
localStorage.setItem('token', body.accessToken)
```

- What breaks, and for whom:
- The fix: login page, youve reached the amount of times you canm attemp to login, either increase the access tokens or change password.


## 4

```ts
useQuery({ queryKey: ['products'], queryFn: () => getProducts(categoryId) })
```

- What breaks, and for whom:
- The fix: 

## 5

```ts
// SpazaStock's products endpoint
const hasMore = page.nextPageToken !== ''
```

- What breaks, and for whom: unable to go to the next page "!=="
- The fix: specify the amount of page tokens , and must stop at null

## 6

```ts
const cents = parseFloat(form.price) * 100
```

- What breaks, and for whom: cents not editable, wont be able to read text
- The fix: const cents = BigInt(whole) * CENTS_PER_RAND + BigInt(fraction)

## 7

```tsx
const save = useMutation({ mutationFn: createSale })
<Button onClick={() => save.mutate(values)}>Save</Button>
```

- What breaks, and for whom: for thw user, theres no create button
- The fix: <Button onClick={() => create.mutate(values)}>Create</Button

## 8

```tsx
<span className="text-red-600">●</span>
```

- What breaks, and for whom: 
- The fix: Specify which className is red, is it a text, icon...
