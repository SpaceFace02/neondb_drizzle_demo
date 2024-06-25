import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, text } from 'drizzle-orm/pg-core'

const sales = pgTable('sales', {
  order_item_id: text('order_item_id'),
  order_id: text('order_id'),
  order_date: text('order_date'),
  order_item_status: text('order_item_status'),
  product_title: text('product_title'),
  quantity: text('quantity'),
})

async function getData() {
  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)
  const result = await db.select().from(sales).execute()
  return result
}

// Create a GET API.

export async function GET() {
  try {
    const data = await getData()
    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
