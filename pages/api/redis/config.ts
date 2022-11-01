// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import redisClient from "./client";

type Data = Record<string, Record<string, string>>;

const config: Record<string, string[]> = {
  NETWORK: [
    "bind",
    "bind-source-addr",

    "protected-mode",
    "enable-protected-configs",
    "enable-debug-command",
    "enable-module-command",

    "port",

    "tcp-backlog",
    "unixsocket",
    "unixsocketperm",
    "timeout",
    "tcp-keepalive",

    "socket-mark-id",
  ],
  "TLS/SSL": [
    "tls-port",

    "tls-cert-file",
    "tls-key-file",
    "tls-key-file-pass",

    "tls-client-cert-file",
    "tls-client-key-file",
    "tls-client-key-file-pass",

    "tls-dh-params-file",

    "tls-ca-cert-file",
    "tls-ca-cert-dir",
    "tls-auth-clients",
    "tls-replication",
    "tls-cluster",
    "tls-protocols",
    "tls-ciphers",
    "tls-ciphersuites",
    "tls-prefer-server-ciphers",
    "tls-session-caching",
    "tls-session-cache-size",
    "tls-session-cache-timeout",
  ],
  GENERAL: [
    "daemonize",
    "supervised",

    "syslog-enabled",
    "syslog-ident",
    "syslog-facility",

    "crash-log-enabled",
    "crash-memcheck-enable",

    "databases",
    "always-show-logo",

    "set-proc-title",
    "proc-title-template",
    "locale-collate",

    "pidfile",
    "loglevel",
    "logfile",
  ],
  "SNAPSHOTTING ": [
    "save",
    "stop-writes-on-bgsave-error",

    "rdbcompression",
    "rdbchecksum",

    "sanitize-dump-payload",
    "dbfilename",
    "rdb-del-sync-files",
    "dir",
  ],
  REPLICATION: [
    "replicaof",
    "masterauth",
    "masteruser",

    "replica-serve-stale-data",
    "replica-read-only",

    "repl-diskless-sync",
    "repl-diskless-sync-delay",
    "repl-diskless-sync-max-replicas",
    "repl-diskless-load",

    "repl-ping-replica-period",
    "repl-timeout",

    "repl-disable-tcp-nodelay",
    "repl-backlog-size",
    "repl-backlog-ttl",
    "replica-priority",
    "propagation-error-behavior",
    "replica-ignore-disk-write-errors",
    "replica-announced",
    "min-replicas-to-write",
    "min-replicas-max-lag",
    "min-replicas-max-lag",
    "replica-announce-ip",
    "replica-announce-port",
  ],
  "KEYS TRACKING": [
    "tracking-table-max-keys",
    "acllog-max-len",
    "aclfile",
    "requirepass",
    "acl-pubsub-default",
  ],
  CLIENTS: [
    "maxclients",
    "maxmemory",
    "maxmemory-policy",
    "maxmemory-samples",
    "maxmemory-eviction-tenacity",
    "replica-ignore-maxmemory",
    "active-expire-effort",
  ],
  "LAZY FREEING": [
    "lazyfree-lazy-eviction",
    "lazyfree-lazy-expire",
    "lazyfree-lazy-server-del",
    "replica-lazy-flush",
    "lazyfree-lazy-user-del",
    "lazyfree-lazy-user-flush",
    "io-threads",
    "io-threads-do-reads",
    "oom-score-adj",
    "oom-score-adj-values",
  ],
  "KERNEL transparent hugepage CONTROL": ["disable-thp"],
  "APPEND ONLY MODE": [
    "appendonly",
    "appendfilename",
    "appenddirname",
    "appendfsync",
    "no-appendfsync-on-rewrite",
    "auto-aof-rewrite-percentage",
    "auto-aof-rewrite-min-size",
    "aof-load-truncated",
    "aof-use-rdb-preamble",
    "aof-timestamp-enabled",
  ],
  SHUTDOWN: [
    "shutdown-timeout",
    "shutdown-on-sigint",
    "shutdown-on-sigterm",
    "lua-time-limit",
    "busy-reply-threshol",
  ],
  "REDIS CLUSTER ": [
    "cluster-enabled",
    "cluster-config-file",
    "cluster-node-timeout",
    "cluster-replica-validity-factor",
    "cluster-migration-barrier",
    "cluster-allow-replica-migration",
    "cluster-require-full-coverage",
    "cluster-replica-no-failover",
    "cluster-allow-reads-when-down",
    "cluster-allow-pubsubshard-when-down",
    "cluster-link-sendbuf-limit",
    "cluster-announce-hostname",
    "cluster-preferred-endpoint-type",
  ],
  "CLUSTER DOCKER/NAT support ": [
    "cluster-announce-ip",
    "cluster-announce-tls-port",
    "cluster-announce-port",
    "cluster-announce-bus-port",
  ],
  "SLOW LOG": [
    "slowlog-log-slower-than",
    "slowlog-max-len",
    "latency-monitor-threshold",
  ],
  "LATENCY TRACKING": ["latency-tracking", "latency-tracking-info-percentiles"],
  "EVENT NOTIFICATION": ["PUBLISH", "notify-keyspace-events"],
  "ADVANCED CONFIG": [
    "hash-max-listpack-entries",
    "hash-max-listpack-value",
    "list-max-listpack-size",
    "list-compress-depth",
    "set-max-intset-entries",
    "zset-max-listpack-value",
    "zset-max-listpack-entries",
    "hll-sparse-max-bytes",
    "stream-node-max-bytes",
    "stream-node-max-entries",
    "activerehashing",
    "client-output-buffer-limit",
    "client-query-buffer-limit",
    "maxmemory-clients",
    "proto-max-bulk-len",
    "hz",
    "dynamic-hz",
    "aof-rewrite-incremental-fsync",
    "rdb-save-incremental-fsync",
    "lfu-log-factor",
    "lfu-decay-time",
  ],
  "ACTIVE DEFRAGMENTATION": [
    "activedefrag",
    "active-defrag-ignore-bytes",
    "active-defrag-threshold-lower",
    "active-defrag-threshold-upper",
    "active-defrag-cycle-min",
    "active-defrag-cycle-max",
    "jemalloc-bg-thread",
    "server_cpulist",
    "bio_cpulist",
    "bgsave_cpulist",
    "ignore-warnings",
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = (await redisClient.config(
    "GET",
    // FIXME: Remove this weird type cast - for some reason the redis client types don't allow a string[], but they say that they do
    Object.values(config).flat() as unknown as string,
    () => {}
  )) as string[];

  const data: Data = {};

  for (let index = 0; index < result.length; index += 2) {
    const key = result[index];
    const value = result[index + 1];
    const cfgZone = Object.entries(config).find(([_, items]) =>
      items.includes(key)
    );

    if (!cfgZone) {
      continue;
    }

    const [zone] = cfgZone;

    if (!data[zone]) {
      data[zone] = {};
    }

    data[zone][key] = value;
  }

  res.status(200).json(data);
}
