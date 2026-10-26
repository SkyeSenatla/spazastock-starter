import {useState, type FormEvent} from 'react'
type props = {
    onCancel: () => void
    onCreated: () => void
}
export function RecordSale({
    onCancel: ()=> void
    onCreated: () => void 
}: Props){
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const number = Number(quantity)
        if (number > 1){
            return price*number
        }
        return(
            <form
            onSubmit = {(event) => void handleSubmit(event)}
            className="space-y-4 rounded-lg border p-5"
    ></form>
    <h3 className="text-xl font-semibold">
Record a sale      </h3>

      <div className="space-y-2">
        <label htmlFor="product-name" className="block font-medium">
Product Name        </label>

        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
          required
          disabled={RecordSale.isPending}
          placeholder="e.g. Lunch Bar"
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

       <div className="space-y-2">
        <label htmlFor="contribution-amount" className="block font-medium">
          Product price (R)
        </label>

        <input
          id="product-price"
          type="number"
          min="1"
          value={amount}
          onChange={(event) => setPrice(event.target.value)}
          required
          disabled={RecordSale.isPending}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

       <div className="space-y-2">
        <label htmlFor="contribution-amount" className="block font-medium">
         How many products were bought:
        </label>

        <input
          id="product-quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
          disabled={RecordSale.isPending}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

       {RecordSale.isError && (
        <p role="alert" className="text-sm text-red-600">
          {RecordSale.error.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={RecordSale.isPending}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {RecordSale.isPending
            ? 'Recording...'
            : 'Record a sale'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={RecordSale.isPending}
          className="rounded-md border px-4 py-2"
        ></button>
        )
    }
}