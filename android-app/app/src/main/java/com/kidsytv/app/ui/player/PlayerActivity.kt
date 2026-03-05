package com.kidsytv.app.ui.player

import android.os.Bundle
import android.view.View
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.exoplayer.dash.DashMediaSource
import androidx.media3.datasource.DefaultHttpDataSource
import com.kidsytv.app.databinding.ActivityPlayerBinding

class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private var player: ExoPlayer? = null
    private var streamUrl: String = ""
    private var title: String = ""
    private var isLive: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        streamUrl = intent.getStringExtra("stream_url") ?: ""
        title = intent.getStringExtra("title") ?: ""
        isLive = intent.getBooleanExtra("is_live", false)

        binding.retryButton.setOnClickListener {
            binding.errorView.visibility = View.GONE
            initPlayer()
        }

        if (streamUrl.isNotEmpty()) {
            initPlayer()
        } else {
            showError()
        }
    }

    private fun initPlayer() {
        binding.loadingProgress.visibility = View.VISIBLE

        player = ExoPlayer.Builder(this).build().also { exoPlayer ->
            binding.playerView.player = exoPlayer

            val dataSourceFactory = DefaultHttpDataSource.Factory()
                .setConnectTimeoutMs(15000)
                .setReadTimeoutMs(15000)
                .setAllowCrossProtocolRedirects(true)

            val mediaItem = MediaItem.fromUri(streamUrl)

            val mediaSource = when {
                streamUrl.contains(".m3u8", ignoreCase = true) -> {
                    HlsMediaSource.Factory(dataSourceFactory).createMediaSource(mediaItem)
                }
                streamUrl.contains(".mpd", ignoreCase = true) -> {
                    DashMediaSource.Factory(dataSourceFactory).createMediaSource(mediaItem)
                }
                else -> {
                    // Default: try as progressive or let ExoPlayer figure it out
                    null
                }
            }

            if (mediaSource != null) {
                exoPlayer.setMediaSource(mediaSource)
            } else {
                exoPlayer.setMediaItem(mediaItem)
            }

            exoPlayer.addListener(object : Player.Listener {
                override fun onPlaybackStateChanged(playbackState: Int) {
                    when (playbackState) {
                        Player.STATE_READY -> {
                            binding.loadingProgress.visibility = View.GONE
                        }
                        Player.STATE_BUFFERING -> {
                            binding.loadingProgress.visibility = View.VISIBLE
                        }
                        Player.STATE_ENDED -> {
                            if (!isLive) {
                                // Video ended
                            }
                        }
                    }
                }

                override fun onPlayerError(error: PlaybackException) {
                    binding.loadingProgress.visibility = View.GONE
                    showError()
                }
            })

            exoPlayer.prepare()
            exoPlayer.playWhenReady = true
        }
    }

    private fun showError() {
        binding.errorView.visibility = View.VISIBLE
        binding.loadingProgress.visibility = View.GONE
    }

    override fun onPause() {
        super.onPause()
        player?.pause()
    }

    override fun onResume() {
        super.onResume()
        player?.play()
    }

    override fun onDestroy() {
        super.onDestroy()
        player?.release()
        player = null
    }
}
