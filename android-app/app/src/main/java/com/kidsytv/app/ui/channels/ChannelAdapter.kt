package com.kidsytv.app.ui.channels

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.kidsytv.app.R
import com.kidsytv.app.data.models.Channel
import com.kidsytv.app.databinding.ItemChannelBinding

class ChannelAdapter(
    private val channels: List<Channel>,
    private val onClick: (Channel) -> Unit
) : RecyclerView.Adapter<ChannelAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemChannelBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemChannelBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val channel = channels[position]
        holder.binding.channelName.text = channel.name

        if (!channel.logo.isNullOrEmpty()) {
            Glide.with(holder.itemView.context)
                .load(channel.logo)
                .placeholder(R.mipmap.ic_launcher)
                .circleCrop()
                .into(holder.binding.channelLogo)
        } else {
            holder.binding.channelLogo.setImageResource(R.mipmap.ic_launcher)
        }

        holder.itemView.setOnClickListener { onClick(channel) }
    }

    override fun getItemCount() = channels.size
}
