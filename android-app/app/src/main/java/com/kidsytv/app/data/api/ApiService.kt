package com.kidsytv.app.data.api

import com.kidsytv.app.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Auth
    @POST("auth/user/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @GET("auth/user/profile")
    suspend fun getProfile(): Response<User>

    // Categories
    @GET("categories")
    suspend fun getCategories(): Response<CategoriesResponse>

    // Channels
    @GET("channels")
    suspend fun getChannels(): Response<ChannelsResponse>

    @GET("channels")
    suspend fun getChannelsByCategory(@Query("categoryId") categoryId: String): Response<ChannelsResponse>

    @GET("channels/{id}")
    suspend fun getChannel(@Path("id") id: String): Response<ChannelResponse>

    // Videos
    @GET("videos")
    suspend fun getVideos(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<VideosResponse>

    @GET("videos")
    suspend fun getVideosByCategory(
        @Query("categoryId") categoryId: String,
        @Query("page") page: Int = 1
    ): Response<VideosResponse>

    @GET("videos")
    suspend fun getFeaturedVideos(@Query("featured") featured: String = "true"): Response<VideosResponse>

    @GET("videos/search")
    suspend fun searchVideos(@Query("q") query: String): Response<SearchResponse>

    @GET("videos/{id}")
    suspend fun getVideo(@Path("id") id: String): Response<VideoResponse>

    // Favorites
    @GET("users/favorites")
    suspend fun getFavorites(): Response<FavoritesResponse>

    @POST("users/favorites")
    suspend fun addFavorite(@Body request: FavoriteRequest): Response<FavoriteResponse>

    @DELETE("users/favorites/{id}")
    suspend fun removeFavorite(@Path("id") id: String): Response<MessageResponse>
}
