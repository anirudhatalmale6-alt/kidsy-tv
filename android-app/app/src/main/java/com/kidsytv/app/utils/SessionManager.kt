package com.kidsytv.app.utils

import android.content.Context
import android.content.SharedPreferences
import com.kidsytv.app.KidsyApp

object SessionManager {
    private const val PREF_NAME = "kidsy_tv_prefs"
    private const val KEY_TOKEN = "auth_token"
    private const val KEY_USER_ID = "user_id"
    private const val KEY_USER_NAME = "user_name"
    private const val KEY_USER_PHONE = "user_phone"
    private const val KEY_USER_COUNTRY = "user_country"
    private const val KEY_API_URL = "api_url"

    private fun prefs(): SharedPreferences {
        return KidsyApp.instance.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun saveAuth(token: String, userId: String, name: String, phone: String, country: String) {
        prefs().edit().apply {
            putString(KEY_TOKEN, token)
            putString(KEY_USER_ID, userId)
            putString(KEY_USER_NAME, name)
            putString(KEY_USER_PHONE, phone)
            putString(KEY_USER_COUNTRY, country)
            apply()
        }
    }

    fun getToken(): String? = prefs().getString(KEY_TOKEN, null)
    fun getUserId(): String? = prefs().getString(KEY_USER_ID, null)
    fun getUserName(): String? = prefs().getString(KEY_USER_NAME, null)
    fun isLoggedIn(): Boolean = getToken() != null

    fun saveApiUrl(url: String) {
        prefs().edit().putString(KEY_API_URL, url).apply()
    }

    fun getApiUrl(): String? = prefs().getString(KEY_API_URL, null)

    fun logout() {
        prefs().edit().clear().apply()
    }
}
