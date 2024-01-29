<template>
    <div class="header-nav">
        <span v-for="item in routers">
            <RouterLink :to="item.path">
                {{item.name}}
            </RouterLink>
        </span>
    </div>
    <RouterView/>
</template>

<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {useRouter} from "vue-router";

const router = useRouter()
const routers = router.getRoutes()
</script>


<style scoped>
.header-nav {
    line-height: 1.5;
    height: 20px;
    position: fixed;
    left: 0;
    top: 0;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
