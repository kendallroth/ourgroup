# OurGroup App

_TODO_

## Caveats

The Vite port **must** match the web container Docker port (all should be same value), to avoid issues with constant HMR refreshes. This is likely due to proxying the server port through Docker without proxying the HMR/websocket port as well!
