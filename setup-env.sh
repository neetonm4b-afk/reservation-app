#!/bin/bash

# Vercel環境変数の設定
vercel env add NEXTAUTH_URL "https://reservation-5xl4dgor8-neetonm4b-gmailcoms-projects.vercel.app"
vercel env add NEXTAUTH_SECRET "$(grep NEXTAUTH_SECRET .env.local | cut -d'=' -f2)"
vercel env add GOOGLE_CLIENT_ID "$(grep GOOGLE_CLIENT_ID .env.local | cut -d'=' -f2)"
vercel env add GOOGLE_CLIENT_SECRET "$(grep GOOGLE_CLIENT_SECRET .env.local | cut -d'=' -f2)"
vercel env add DATABASE_URL "$(grep DATABASE_URL .env.local | cut -d'=' -f2)"
vercel env add RESEND_API_KEY "$(grep RESEND_API_KEY .env.local | cut -d'=' -f2)"
vercel env add AUTH_SECRET "$(grep AUTH_SECRET .env.local | cut -d'=' -f2)"
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY "$(grep NEXT_PUBLIC_STRIPE_PUBLIC_KEY .env.local | cut -d'=' -f2)"
vercel env add STRIPE_SECRET_KEY "$(grep STRIPE_SECRET_KEY .env.local | cut -d'=' -f2)"
vercel env add LINE_CHANNEL_ID "$(grep LINE_CHANNEL_ID .env.local | cut -d'=' -f2)"
vercel env add LINE_CHANNEL_SECRET "$(grep LINE_CHANNEL_SECRET .env.local | cut -d'=' -f2)"
vercel env add CRON_SECRET "$(grep CRON_SECRET .env.local | cut -d'=' -f2)"
