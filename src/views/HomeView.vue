<template>
  <div class="home">
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Welcome to Alchemorsel</h1>
        <p class="hero__subtitle">Your AI-powered recipe companion</p>
        <div class="hero__buttons">
          <router-link to="/register" class="btn btn-primary"
            >Get Started</router-link
          >
          <router-link to="/login" class="btn btn-secondary"
            >Sign In</router-link
          >
        </div>
      </div>
    </section>

    <section class="features">
      <h2 class="features__title">Why Choose Alchemorsel?</h2>
      <div class="features__grid">
        <div class="feature-card">
          <h3>AI-Powered Recipes</h3>
          <p>
            Generate unique recipes tailored to your preferences and dietary
            needs
          </p>
        </div>
        <div class="feature-card">
          <h3>Smart Modifications</h3>
          <p>
            Easily modify recipes to suit your taste or available ingredients
          </p>
        </div>
        <div class="feature-card">
          <h3>Nutritional Insights</h3>
          <p>Get detailed nutritional information and allergy warnings</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    #369870 100%
  );
  color: white;
  padding: 4rem 2rem;
  text-align: center;

  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  &__subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  &__buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;

    .btn {
      padding: 0.75rem 2rem;
      font-size: 1.1rem;
    }

    .btn-secondary {
      background-color: transparent;
      border: 2px solid white;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.features {
  padding: 4rem 2rem;
  background-color: var(--background-color);

  &__title {
    text-align: center;
    margin-bottom: 3rem;
    color: var(--secondary-color);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    opacity: 0.8;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &-primary {
    background-color: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--primary-color-dark);
    }
  }

  &-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;

    &__title {
      font-size: 2.5rem;
    }

    &__subtitle {
      font-size: 1.2rem;
    }

    &__buttons {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }
  }

  .features {
    padding: 3rem 1rem;
  }
}
</style>   