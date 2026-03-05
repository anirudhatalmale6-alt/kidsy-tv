package com.kidsytv.app.ui.home

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
import com.kidsytv.app.databinding.FragmentHomeBinding
import com.kidsytv.app.ui.channels.ChannelAdapter
import com.kidsytv.app.ui.player.PlayerActivity
import com.kidsytv.app.ui.videos.VideoHorizontalAdapter
import com.kidsytv.app.utils.SessionManager
import kotlinx.coroutines.*

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val name = SessionManager.getUserName() ?: "User"
        binding.welcomeText.text = "Welcome, $name"

        binding.channelsRecycler.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        binding.featuredRecycler.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        binding.videosRecycler.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)

        binding.swipeRefresh.setOnRefreshListener { loadData() }
        loadData()
    }

    private fun loadData() {
        scope.launch {
            try {
                val channelsDeferred = async(Dispatchers.IO) { RetrofitClient.getApi().getChannels() }
                val videosDeferred = async(Dispatchers.IO) { RetrofitClient.getApi().getVideos() }
                val featuredDeferred = async(Dispatchers.IO) { RetrofitClient.getApi().getFeaturedVideos() }

                val channelsResp = channelsDeferred.await()
                val videosResp = videosDeferred.await()
                val featuredResp = featuredDeferred.await()

                if (channelsResp.isSuccessful) {
                    val channels = channelsResp.body()?.channels ?: emptyList()
                    binding.channelsRecycler.adapter = ChannelAdapter(channels) { onChannelClick(it) }
                }

                if (featuredResp.isSuccessful) {
                    val featured = featuredResp.body()?.videos ?: emptyList()
                    binding.featuredRecycler.adapter = VideoHorizontalAdapter(featured) { onVideoClick(it) }
                }

                if (videosResp.isSuccessful) {
                    val videos = videosResp.body()?.videos ?: emptyList()
                    binding.videosRecycler.adapter = VideoHorizontalAdapter(videos) { onVideoClick(it) }
                }
            } catch (e: Exception) {
                // Network error - silently handle
            } finally {
                binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    private fun onChannelClick(channel: Channel) {
        startActivity(Intent(requireContext(), PlayerActivity::class.java).apply {
            putExtra("stream_url", channel.streamUrl)
            putExtra("title", channel.name)
            putExtra("is_live", true)
        })
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
