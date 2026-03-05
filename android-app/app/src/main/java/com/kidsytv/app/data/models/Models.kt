package com.kidsytv.app.data.models

import com.google.gson.annotations.SerializedName

// Auth
data class RegisterRequest(
    val name: String,
    val phone: String,
    val country: String
)

data class AuthResponse(
    val token: String,
    val user: User
)

data class User(
    val id: String,
    val name: String,
    val phone: String,
    val country: String
)

// Category
data class Category(
    val id: String,
    val name: String,
    val nameAr: String?,
    val icon: String?,
    val order: Int,
    val isActive: Boolean
)

data class CategoriesResponse(val categories: List<Category>)

// Channel
data class Channel(
    val id: String,
    val name: String,
    val streamUrl: String,
    val streamType: String,
    val logo: String?,
    val description: String?,
    val categoryId: String?,
    val category: Category?,
    val order: Int,
    val isActive: Boolean,
    val viewCount: Int
)

data class ChannelsResponse(val channels: List<Channel>)
data class ChannelResponse(val channel: Channel)

// Video
data class Video(
    val id: String,
    val title: String,
    val description: String?,
    val videoUrl: String,
    val videoType: String,
    val thumbnail: String?,
    val duration: Int?,
    val categoryId: String?,
    val category: Category?,
    val order: Int,
    val isActive: Boolean,
    val viewCount: Int,
    val isFeatured: Boolean
)

data class VideosResponse(
    val videos: List<Video>,
    val total: Int?,
    val page: Int?,
    val totalPages: Int?
)

data class VideoResponse(val video: Video)

// Search
data class SearchResponse(val videos: List<Video>)

// Favorites
data class Favorite(
    val id: String,
    val userId: String,
    val channelId: String?,
    val videoId: String?,
    val type: String,
    val channel: Channel?,
    val video: Video?
)

data class FavoritesResponse(val favorites: List<Favorite>)
data class FavoriteRequest(val type: String, val channelId: String?, val videoId: String?)
data class FavoriteResponse(val favorite: Favorite)
data class MessageResponse(val message: String)
