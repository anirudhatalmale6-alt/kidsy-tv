package com.kidsytv.app

import android.app.Application

class KidsyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    companion object {
        lateinit var instance: KidsyApp
            private set
    }
}
