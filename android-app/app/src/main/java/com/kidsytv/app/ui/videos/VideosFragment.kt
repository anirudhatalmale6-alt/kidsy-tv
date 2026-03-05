package com.kidsytv.app.ui.videos

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import com.kidsytv.app.data.api.RetrofitClient
import com.kidsytv.app.data.models.Video
import com.kidsytv.app.databinding.FragmentVideosBinding
import com.kidsytv.app.ui.player.PlayerActivity
import kotlinx.coroutines.*

class VideosFragment : Fragment() {
    private var _binding: FragmentVideosBinding? = null
    private val binding get() = _binding!!
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentVideosBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.videosRecycler.layoutManager = GridLayoutManager(context, 2)
        loadVideos()
    }

    private fun loadVideos() {
        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) { RetrofitClient.getApi().getVideos() }
                if (response.isSuccessful) {
                    val videos = response.body()?.videos ?: emptyList()
                    binding.videosRecycler.adapter = VideoAdapter(videos) { onVideoClick(it) }
                }
            } catch (e: Exception) { /* silently handle */ }
        }
    }

    private fun onVideoClick(video: Video) {
        startActivity(Intent(requireContext(), PlayerActivity::class.java).apply {
            putExtra("stream_url", video.videoUrl)
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
