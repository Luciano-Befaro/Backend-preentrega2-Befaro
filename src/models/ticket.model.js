import mongoose from 'mongoose'

const TicketSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
})

export const TicketModel = mongoose.model('Ticket', TicketSchema)