
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DonationPayload {
  upi_id: string;
  amount: string;
  note?: string;
  sender: string;
  app: string;
  timestamp: string;
  signature?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiToken = authHeader.replace('Bearer ', '')

    // Find user by API token
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, upi_id')
      .eq('api_token', apiToken)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Invalid API token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse donation data
    const payload: DonationPayload = await req.json()

    // Validate required fields
    if (!payload.upi_id || !payload.amount || !payload.sender || !payload.app || !payload.timestamp) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate amount is a valid number
    const amount = parseFloat(payload.amount)
    if (isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert donation into database
    const { data: donation, error: insertError } = await supabaseClient
      .from('donations')
      .insert([
        {
          user_id: profile.id,
          upi_id: payload.upi_id,
          amount: payload.amount,
          sender_name: payload.sender,
          message: payload.note || null,
          app_source: payload.app,
          timestamp: payload.timestamp,
          signature: payload.signature || null
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to save donation' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        donation_id: donation.id,
        message: 'Donation received successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
