<script setup lang="ts"></script>

<template>
  <Transition name="drop-down" appear>
    <div class="max-w-[80%] h-[80%] flex flex-col justify-center items-center gap-6">
      <div class="max-w-[80%]">
        <h1 class="home-welcome__title">
          ShopMVP — это демонстрационная платформа электронной коммерции
        </h1>
        <p class="home-welcome__copy">
          Разработанная для тестирования современных веб-технологий. Приложение создано на стеке Vue
          3 + Element Plus + Tailwind CSS и демонстрирует возможности быстрой разработки адаптивных
          интерфейсов с фильтрацией, поиском и корзиной покупок. Проект открыт для изучения
          архитектуры MVP-решений.
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drop-down-enter-active,
.drop-down-leave-active {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.drop-down-enter-from {
  opacity: 0;
  transform: translateY(-300px) scale(0.1);
}

.drop-down-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.drop-down-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.drop-down-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.home-welcome__title {
  margin: 0 0 1rem;

  font-size: clamp(2rem, 4.2vw, 3rem);
  font-weight: 650;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #244a97;
  animation: hw-rise 0.75s ease both;
}

.home-welcome__copy {
  margin: 0;

  font-size: 1rem;
  line-height: 1.65;
  color: #64748b;
  animation: hw-rise 0.75s ease 0.08s both;
}
</style>
