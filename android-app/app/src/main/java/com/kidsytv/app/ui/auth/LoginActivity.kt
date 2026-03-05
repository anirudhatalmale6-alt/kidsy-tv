package com.kidsytv.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.kidsytv.app.data.api.RetrofitClient
import com.kidsytv.app.data.models.RegisterRequest
import com.kidsytv.app.databinding.ActivityLoginBinding
import com.kidsytv.app.ui.home.MainActivity
import com.kidsytv.app.utils.SessionManager
import kotlinx.coroutines.*

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (SessionManager.isLoggedIn()) {
            goToMain()
            return
        }

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.loginButton.setOnClickListener { doRegister() }
    }

    private fun doRegister() {
        val name = binding.nameInput.text.toString().trim()
        val phone = binding.phoneInput.text.toString().trim()
        val country = binding.countryInput.text.toString().trim()

        if (name.isEmpty()) {
            binding.nameInput.error = "Name is required"
            return
        }
        if (phone.isEmpty()) {
            binding.phoneInput.error = "Phone is required"
            return
        }
        if (country.isEmpty()) {
            binding.countryInput.error = "Country is required"
            return
        }

        binding.loginButton.isEnabled = false
        binding.progressBar.visibility = View.VISIBLE

        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    RetrofitClient.getApi().register(RegisterRequest(name, phone, country))
                }
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    SessionManager.saveAuth(
                        body.token, body.user.id, body.user.name,
                        body.user.phone, body.user.country
                    )
                    goToMain()
                } else {
                    Toast.makeText(this@LoginActivity, "Registration failed", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@LoginActivity, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.loginButton.isEnabled = true
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    private fun goToMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
