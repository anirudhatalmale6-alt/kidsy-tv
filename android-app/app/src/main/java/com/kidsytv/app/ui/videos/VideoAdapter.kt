package com.kidsytv.app.ui.videos

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.kidsytv.app.data.models.Video
import com.kidsytv.app.databinding.ItemVideoBinding

class VideoAdapter(
    private val videos: List<Video>,
    private val onClick: (Video) -> Unit
) : RecyclerView.Adapter<VideoAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemVideoBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemVideoBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val video = videos[position]
        holder.binding.videoTitle.text = video.title
        holder.binding.videoViews.text = "${video.viewCount} views"

        if (video.duration != null && video.duration > 0) {
            val mins = video.duration / 60
            val secs = video.duration % 60
            holder.binding.videoDuration.text = "${mins}:${String.format("%02d", secs)}"
        } else {
            holder.binding.videoDuration.text = ""
        }

        if (!video.thumbnail.isNullOrEmpty()) {
            Glide.with(holder.itemView.context)
                .load(video.thumbnail)
                .centerCrop()
                .into(holder.binding.videoThumbnail)
        }

        holder.itemView.setOnClickListener { onClick(video) }
    }

    override fun getItemCount() = videos.size
}
