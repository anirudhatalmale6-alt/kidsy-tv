package com.kidsytv.app.ui.channels

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import com.kidsytv.app.data.api.RetrofitClient
import com.kidsytv.app.data.models.Channel
import com.kidsytv.app.databinding.FragmentChannelsBinding
import com.kidsytv.app.ui.player.PlayerActivity
import kotlinx.coroutines.*

class ChannelsFragment : Fragment() {
    private var _binding: FragmentChannelsBinding? = null
    private val binding get() = _binding!!
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentChannelsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.channelsRecycler.layoutManager = GridLayoutManager(context, 3)
        loadChannels()
    }

    private fun loadChannels() {
        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) { RetrofitClient.getApi().getChannels() }
                if (response.isSuccessful) {
                    val channels = response.body()?.channels ?: emptyList()
                    binding.channelsRecycler.adapter = ChannelGridAdapter(channels) { onChannelClick(it) }
                }
            } catch (e: Exception) { /* silently handle */ }
        }
    }

    private fun onChannelClick(channel: Channel) {
        startActivity(Intent(requireContext(), PlayerActivity::class.java).apply {
            putExtra("stream_url", channel.streamUrl)
            putExtra("title", channel.name)
            putExtra("is_live", true)
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        scope.cancel()
        _binding = null
    }
}
