package com.kidsytv.app.ui.common

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.kidsytv.app.data.api.RetrofitClient
import com.kidsytv.app.data.models.Channel
import com.kidsytv.app.data.models.Video
import com.kidsytv.app.databinding.FragmentFavoritesBinding
import com.kidsytv.app.ui.player.PlayerActivity
import kotlinx.coroutines.*

class FavoritesFragment : Fragment() {
    private var _binding: FragmentFavoritesBinding? = null
    private val binding get() = _binding!!
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentFavoritesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.favoritesRecycler.layoutManager = LinearLayoutManager(context)
        loadFavorites()
    }

    private fun loadFavorites() {
        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) { RetrofitClient.getApi().getFavorites() }
                if (response.isSuccessful) {
                    val favorites = response.body()?.favorites ?: emptyList()
                    if (favorites.isEmpty()) {
                        binding.emptyText.visibility = View.VISIBLE
                        binding.favoritesRecycler.visibility = View.GONE
                    } else {
                        binding.emptyText.visibility = View.GONE
                        binding.favoritesRecycler.visibility = View.VISIBLE
                        // Extract videos from favorites and display
                        val videos = favorites.mapNotNull { it.video }
                        binding.favoritesRecycler.adapter = com.kidsytv.app.ui.videos.VideoAdapter(videos) { onVideoClick(it) }
                    }
                }
            } catch (e: Exception) { /* silently handle */ }
        }
    }

    private fun onVideoClick(video: Video) {
        startActivity(Intent(requireContext(), PlayerActivity::class.java).apply {
            putExtra("stream_url", video.getPlayableUrl())
            putExtra("title", video.title)
            putExtra("is_live", false)
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        scope.cancel()
        _binding = null
    }
}
