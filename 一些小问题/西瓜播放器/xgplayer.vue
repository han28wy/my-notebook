<template>
    <div id="video-player" class="video-player"></div>
  </template>
  
  <script
    src="//unpkg.byted-static.com/xgplayer/2.31.2/browser/index.js"
    type="text/javascript"
  ></script>
  <script>
  import Player from 'xgplayer'
  import '../../../../assets/xgplayer/.xgplayer/skin/index.js'
  export default {
    props: {
      url: {
        type: String,
        default: '',
      },
      poster: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        player: null,
      }
    },
    mounted() {
      this.initPlayer()
    },
    created() {},
    watch: {
      url: {
        handler(newValue, oldValue) {
          if (!this.player) {
            this.initPlayer()
            return
          }
          // 切换视频源
          this.player.src = this.url
          this.player.poster = this.poster
        },
      },
    },
    methods: {
      initPlayer() {
        // url不存在
        if (!this.url) return
        const config = {
          id: 'video-player',
          url: this.url,
          poster: this.poster,
          fluid: true,
          /** 倍速播放 */
          playbackRate: [0.5, 0.75, 1, 1.5, 2],
          defaultPlaybackRate: 1,
          playsinline: true,
          autoplay: false,
          whitelist: [''],
        }
       this.player = new Player(config)
      },
    },
  }
  </script>
  
  <style lang="less" scoped>
  .video-player {
    height: 2.3rem;
  }
  </style>
  