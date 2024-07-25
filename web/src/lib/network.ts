import { execa } from 'execa';

export default class Network {
  public static async interfaceExists(inet: string): Promise<boolean> {
    try {
      const { stdout: o } = await execa(`ip link show | grep ${inet}`, { shell: true });
      return o.trim() !== '';
    } catch (e) {
      return false;
    }
  }

  public static async interfacesInUse(): Promise<string[]> {
    try {
      // const command = `ip -o link show | awk -F' ' ' {print $2,  $3}' | sed 's/[<>:]//g'`;
      // o.split('\n').reduce((obj, l) => {
      //   const [iface, conn] = l.split(' ');
      // });
      // aggr;
      const command = `ip -o link show | awk -F ': ' '{print $2}'`;
      const { stdout: o } = await execa(command, { shell: true });

      return o.trim().split('\n');
    } catch (e) {
      return [];
    }
  }

  public static async interfaceInfo(interfaceName: string): Promise<string[]> {
    const [name, ...rest] = interfaceName;

    const command = `ip -tunnel | awk -F ': ' '{print $1}'`;
    const { stdout: tunnelNames } = await execa(command, { shell: true });
  }

  public static async inUsePorts(): Promise<number[]> {
    const ports = [];
    const { stdout: output } = await execa(
      `netstat -tulpn | grep LISTEN | awk '{print $4}' | awk -F ':' '{print $NF}'`,
      { shell: true }
    );
    for (const line of output.split('\n')) {
      const clean = Number(line.trim());
      if (!isNaN(clean) && clean !== 0) ports.push(clean);
    }

    return ports;
  }
}
