package com.kidsytv.app.ui.home

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.kidsytv.app.R
import com.kidsytv.app.databinding.ActivityMainBinding
import com.kidsytv.app.ui.channels.ChannelsFragment
import com.kidsytv.app.ui.videos.VideosFragment
import com.kidsytv.app.ui.common.FavoritesFragment

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (savedInstanceState == null) {
            loadFragment(HomeFragment())
        }

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> { loadFragment(HomeFragment()); true }
                R.id.nav_channels -> { loadFragment(ChannelsFragment()); true }
                R.id.nav_videos -> { loadFragment(VideosFragment()); true }
                R.id.nav_favorites -> { loadFragment(FavoritesFragment()); true }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
