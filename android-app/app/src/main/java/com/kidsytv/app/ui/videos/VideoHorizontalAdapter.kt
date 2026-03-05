package com.kidsytv.app.ui.videos

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.kidsytv.app.data.models.Video
import com.kidsytv.app.databinding.ItemVideoHorizontalBinding

class VideoHorizontalAdapter(
    private val videos: List<Video>,
    private val onClick: (Video) -> Unit
) : RecyclerView.Adapter<VideoHorizontalAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemVideoHorizontalBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemVideoHorizontalBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val video = videos[position]
        holder.binding.videoTitle.text = video.title

        if (!video.getThumbnailUrl().isNullOrEmpty()) {
            Glide.with(holder.itemView.context)
                .load(video.getThumbnailUrl())
                .centerCrop()
                .into(holder.binding.videoThumbnail)
        }

        holder.itemView.setOnClickListener { onClick(video) }
    }

    override fun getItemCount() = videos.size
}
