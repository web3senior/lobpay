/**
 * @file app/api/v1/auth/logout/route.js
 * @description Destroys the merchant session by clearing the JWT cookie.
 */

import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    /**
     * Clear the merchant_session cookie.
     * We set the expiration to the past and maxAge to 0 to ensure
     * the browser removes it immediately.
     */
    response.cookies.set('merchant_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[AUTH_LOGOUT_ERROR]:', error)
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 })
  }
}
