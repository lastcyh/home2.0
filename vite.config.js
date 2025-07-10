/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html"; // 添加的依赖

// https://vitejs.dev/config/
export default ({ mode }) => {
  // 加载环境变量 (放到配置顶层确保多插件可用)
  const env = loadEnv(mode, process.cwd());
  
  return defineConfig({
    plugins: [
      vue(),
      // 添加HTML变量注入插件 (需在最顶部插件之一)
      createHtmlPlugin({
        inject: {
          data: {
            VITE_SITE_LOGO: env.VITE_SITE_LOGO || "/logo.png",
            VITE_SITE_APPLE_LOGO: env.VITE_SITE_APPLE_LOGO || "/apple-touch-icon.png",
            VITE_SITE_DES: env.VITE_SITE_DES || "网站描述",
            VITE_SITE_KEYWORDS: env.VITE_SITE_KEYWORDS || "关键词1,关键词2",
            VITE_SITE_AUTHOR: env.VITE_SITE_AUTHOR || "作者",
            VITE_SITE_NAME: env.VITE_SITE_NAME || "网站名称"
          }
        },
        minify: true
      }),
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /(.*?)\.(js|css|woff2|woff|ttf)/,
              handler: "CacheFirst",
              options: { cacheName: "js-css-cache" }
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
              handler: "CacheFirst",
              options: { cacheName: "image-cache" }
            }
          ]
        },
        manifest: {
          // 改用已经加载的env变量，避免重复加载
          name: env.VITE_SITE_NAME,
          short_name: env.VITE_SITE_NAME,
          description: env.VITE_SITE_DES,
          display: "standalone",
          start_url: "/",
          theme_color: "#424242",
          background_color: "#424242",
          icons: [
            { src: "/images/icon/48.png", sizes: "48x48", type: "image/png" },
            { src: "/images/icon/72.png", sizes: "72x72", type: "image/png" },
            { src: "/images/icon/96.png", sizes: "96x96", type: "image/png" },
            { src: "/images/icon/128.png", sizes: "128x128", type: "image/png" },
            { src: "/images/icon/144.png", sizes: "144x144", type: "image/png" },
            { src: "/images/icon/192.png", sizes: "192x192", type: "image/png" },
            { src: "/images/icon/512.png", sizes: "512x512", type: "image/png" }
          ]
        }
      }),
      viteCompression()
    ],
    server: {
      port: "3000",
      open: true
    },
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "./src/style/global.scss";`
        }
      }
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"]
        }
      }
    }
  });
};
